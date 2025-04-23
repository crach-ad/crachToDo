import { doc, getDoc, updateDoc, setDoc, collection, addDoc, query, where, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { UserStats } from '@/lib/types'

/**
 * Get user stats from Firestore
 * @param userId - The ID of the user to get stats for
 * @returns The user's stats or null if not found
 */
export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return {
        rank: userData.rank,
        level: userData.level,
        currentXP: userData.currentXP,
        requiredXP: userData.requiredXP
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting user stats:', error)
    throw error
  }
}

/**
 * Subscribe to user stats changes in real-time
 * @param userId - The ID of the user to subscribe to
 * @param onStatsUpdate - Callback function that receives updated stats
 * @returns An unsubscribe function
 */
export function subscribeToUserStats(userId: string, onStatsUpdate: (stats: UserStats) => void) {
  const userRef = doc(db, 'users', userId)
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const userData = doc.data()
      onStatsUpdate({
        rank: userData.rank,
        level: userData.level,
        currentXP: userData.currentXP,
        requiredXP: userData.requiredXP
      })
    }
  })
}

/**
 * Add XP to a user and handle level-ups
 * @param userId - The ID of the user to add XP to
 * @param xpAmount - The amount of XP to add
 * @returns Object containing level-up information and new stats
 */
export async function addXP(userId: string, xpAmount: number) {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      let { currentXP, requiredXP, level, rank } = userData
      
      // Add the XP
      currentXP += xpAmount
      
      // Check if leveled up
      let didLevelUp = false
      let previousRank = rank
      
      // While user has enough XP to level up
      while (currentXP >= requiredXP) {
        // Level up
        level += 1
        currentXP -= requiredXP
        didLevelUp = true
        
        // Calculate new required XP (increases with each level)
        requiredXP = Math.floor(requiredXP * 1.2)
        
        // Check if rank should change
        if (level % 10 === 0) {
          previousRank = rank
          // Rank progression: E -> D -> C -> B -> A -> S
          switch (rank) {
            case 'E': rank = 'D'; break;
            case 'D': rank = 'C'; break;
            case 'C': rank = 'B'; break;
            case 'B': rank = 'A'; break;
            case 'A': rank = 'S'; break;
          }
        }
      }
      
      // Update user in database
      await updateDoc(userRef, {
        currentXP,
        requiredXP,
        level,
        rank
      })
      
      // Record level up event if it happened
      if (didLevelUp) {
        await addDoc(collection(db, 'levelEvents'), {
          userId,
          oldLevel: level - 1,
          newLevel: level,
          oldRank: previousRank,
          newRank: rank,
          timestamp: Timestamp.now(),
          xpGained: xpAmount
        })
      }
      
      return {
        didLevelUp,
        newStats: { rank, level, currentXP, requiredXP },
        previousRank: didLevelUp && previousRank !== rank ? previousRank : null
      }
    }
    
    return { didLevelUp: false, newStats: null, previousRank: null }
  } catch (error) {
    console.error('Error adding XP:', error)
    throw error
  }
}

/**
 * Subscribe to user level-up history
 * @param userId - The ID of the user to get history for
 * @param onHistoryUpdate - Callback function that receives updated history
 * @returns An unsubscribe function
 */
export function subscribeToLevelHistory(userId: string, onHistoryUpdate: (history: any[]) => void) {
  const historyQuery = query(
    collection(db, 'levelEvents'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  )
  
  return onSnapshot(historyQuery, (snapshot) => {
    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toISOString()
    }))
    
    onHistoryUpdate(history)
  })
}
