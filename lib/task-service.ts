import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  getDoc,
  onSnapshot,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Task as BaseTask } from '@/lib/types'

// Internal Task interface that extends the base one with userId
interface Task extends Omit<BaseTask, 'id' | 'recurring'> {
  id?: string;
  userId: string;
  recurring?: {
    type: "daily" | "weekly" | "monthly" | "custom";
    days?: number[];
    interval?: number;
    nextDue?: string | null;
  };
}

// Firestore variant of the Task interface that uses Timestamp instead of string for dates
interface FirestoreTask extends Omit<Task, 'createdAt' | 'recurring'> {
  createdAt: Timestamp;
  recurring?: {
    type: "daily" | "weekly" | "monthly" | "custom";
    days?: number[];
    interval?: number;
    nextDue?: Timestamp | null;
  } | null;
}

/**
 * Subscribe to tasks for a specific user
 * @param userId - The user ID to get tasks for
 * @param callback - Callback function to receive tasks
 * @returns An unsubscribe function
 */
export function subscribeToTasks(userId: string, callback: (tasks: import('@/lib/types').Task[]) => void) {
  // Query tasks for this user, ordered by creation date
  const tasksQuery = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  
  // Subscribe to query
  return onSnapshot(tasksQuery, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => {
      const data = doc.data()
      
      // Convert Firestore dates back to ISO strings and ensure all required fields
      return {
        id: doc.id,
        name: data.name || '',
        completed: data.completed || false,
        description: data.description,
        priority: data.priority,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        recurring: data.recurring ? {
          type: data.recurring.type,
          interval: data.recurring.interval,
          days: data.recurring.days,
          nextDue: data.recurring.nextDue ? data.recurring.nextDue.toDate().toISOString() : undefined
        } : undefined
      } as import('@/lib/types').Task
    })
    
    callback(tasks)
  });
}

/**
 * Add a new task to Firestore
 * @param userId - The user ID the task belongs to
 * @param task - The task to add (without ID)
 * @returns The ID of the newly created task
 */
export async function addTask(userId: string, task: Omit<Task, 'id'>) {
  try {
    // Convert dates to Firestore Timestamps
    const firestoreTask: FirestoreTask = {
      ...task,
      userId,
      createdAt: Timestamp.fromDate(new Date(task.createdAt || new Date().toISOString())),
      recurring: task.recurring ? {
        ...task.recurring,
        nextDue: task.recurring.nextDue ? Timestamp.fromDate(new Date(task.recurring.nextDue)) : null
      } : null
    }
    
    const docRef = await addDoc(collection(db, 'tasks'), firestoreTask)
    return docRef.id
  } catch (error) {
    console.error('Error adding task:', error)
    throw error
  }
}

/**
 * Update an existing task in Firestore
 * @param taskId - The ID of the task to update
 * @param updates - The fields to update
 * @param userId - The ID of the user who owns the task (required for security verification)
 */
export async function updateTask(taskId: string, updates: Partial<Task>, userId: string) {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    
    // Always verify the task belongs to this user
    const taskSnapshot = await getDoc(taskRef)
    
    if (!taskSnapshot.exists()) {
      throw new Error('Task not found')
    }
    
    const taskData = taskSnapshot.data()
    if (!taskData || taskData.userId !== userId) {
      throw new Error('Permission denied: You can only update your own tasks')
    }
    
    // Convert dates to Firestore Timestamps if present
    const firestoreUpdates: Record<string, any> = { ...updates }
    
    if (updates.recurring) {
      firestoreUpdates.recurring = {
        ...updates.recurring,
        nextDue: updates.recurring.nextDue ? Timestamp.fromDate(new Date(updates.recurring.nextDue)) : null
      }
    }
    
    // Always include userId in updates to prevent it from being removed
    firestoreUpdates.userId = userId
    
    await updateDoc(taskRef, firestoreUpdates)
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

/**
 * Delete a task from Firestore
 * @param taskId - The ID of the task to delete
 * @param userId - The ID of the user who owns the task (required for security verification)
 */
export async function deleteTask(taskId: string, userId: string) {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    
    // Always verify the task belongs to this user
    const taskSnapshot = await getDoc(taskRef)
    
    if (!taskSnapshot.exists()) {
      throw new Error('Task not found')
    }
    
    const taskData = taskSnapshot.data()
    if (!taskData || taskData.userId !== userId) {
      throw new Error('Permission denied: You can only delete your own tasks')
    }
    
    await deleteDoc(taskRef)
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

/**
 * Get all tasks for a user (one-time fetch)
 * @param userId - The user ID to get tasks for
 * @returns An array of tasks
 */
export async function getTasks(userId: string): Promise<Task[]> {
  try {
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const snapshot = await getDocs(tasksQuery)
    
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to ISO string for the frontend
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        recurring: data.recurring ? {
          ...data.recurring,
          nextDue: data.recurring.nextDue?.toDate().toISOString()
        } : undefined
      }
    }) as Task[]
  } catch (error) {
    console.error('Error getting tasks:', error)
    return []
  }
}
