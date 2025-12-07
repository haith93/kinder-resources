// src/services/resourceService.js
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'resources';

/**
 * Fetch all resources from Firestore
 * @returns {Promise<Array>} Array of resource objects
 */
export const getAllResources = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const resources = [];
    querySnapshot.forEach((doc) => {
      resources.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return resources;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

/**
 * Fetch resources filtered by subject
 * @param {string} subject - Subject to filter by
 * @returns {Promise<Array>} Filtered array of resources
 */
export const getResourcesBySubject = async (subject) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('subject', '==', subject)
    );
    const querySnapshot = await getDocs(q);
    const resources = [];
    querySnapshot.forEach((doc) => {
      resources.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return resources;
  } catch (error) {
    console.error('Error fetching resources by subject:', error);
    throw error;
  }
};

/**
 * Add a new resource to Firestore
 * @param {Object} resourceData - Resource data to add
 * @returns {Promise<string>} ID of the newly created document
 */
export const addResource = async (resourceData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...resourceData,
      createdAt: serverTimestamp(),
      likes: resourceData.likes || 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding resource:', error);
    throw error;
  }
};

/**
 * Update an existing resource
 * @param {string} resourceId - ID of resource to update
 * @param {Object} updates - Fields to update
 */
export const updateResource = async (resourceId, updates) => {
  try {
    const resourceRef = doc(db, COLLECTION_NAME, resourceId);
    await updateDoc(resourceRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
};

/**
 * Delete a resource
 * @param {string} resourceId - ID of resource to delete
 */
export const deleteResource = async (resourceId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, resourceId));
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
};

/**
 * Increment the likes count for a resource
 * @param {string} resourceId - ID of resource to like
 */
export const likeResource = async (resourceId, currentLikes) => {
  try {
    const resourceRef = doc(db, COLLECTION_NAME, resourceId);
    await updateDoc(resourceRef, {
      likes: currentLikes + 1
    });
  } catch (error) {
    console.error('Error liking resource:', error);
    throw error;
  }
};