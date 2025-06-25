import { Component, OnInit } from '@angular/core';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../environments/firebase';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
  standalone: false
})
export class GoalsPage implements OnInit {

  goalLabel: string = '';
  goalValue: number = 1000;
  goals: { id: string; label: string; value: number }[] = [];

  isEditing: boolean = false;
  editingIndex: number | null = null;

  constructor() {}

  ngOnInit() {
    this.loadGoalsFromFirestore();
  }

  async loadGoalsFromFirestore() {
    try {
      const querySnapshot = await getDocs(collection(db, 'goals'));
      this.goals = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as { label: string; value: number })
      }));
      console.log('📥 Goals loaded from Firestore.');
    } catch (error) {
      console.error('❌ Error loading goals:', error);
    }
  }

  async addGoal() {
    if (!this.goalLabel || !this.goalValue) return;

    if (this.isEditing && this.editingIndex !== null) {
      const goalToUpdate = this.goals[this.editingIndex];
      try {
        const goalRef = doc(db, 'goals', goalToUpdate.id);
        await updateDoc(goalRef, {
          label: this.goalLabel,
          value: this.goalValue,
          timestamp: new Date()
        });

        this.goals[this.editingIndex] = {
          id: goalToUpdate.id,
          label: this.goalLabel,
          value: this.goalValue
        };

        console.log('✏️ Goal updated in Firestore.');
        this.cancelEdit();
      } catch (e) {
        console.error('❌ Failed to update goal:', e);
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, 'goals'), {
          label: this.goalLabel,
          value: this.goalValue,
          timestamp: new Date()
        });

        this.goals.push({
          id: docRef.id,
          label: this.goalLabel,
          value: this.goalValue
        });

        console.log('✅ Goal added to Firestore.');
        this.goalLabel = '';
        this.goalValue = 1000;
      } catch (e) {
        console.error('❌ Error adding goal to Firestore:', e);
      }
    }
  }

  editGoal(index: number) {
    this.goalLabel = this.goals[index].label;
    this.goalValue = this.goals[index].value;
    this.isEditing = true;
    this.editingIndex = index;
  }

  async deleteGoal(index: number) {
    const goalToDelete = this.goals[index];
    try {
      await deleteDoc(doc(db, 'goals', goalToDelete.id));
      this.goals.splice(index, 1);
      this.cancelEdit();
      console.log('🗑️ Goal deleted from Firestore.');
    } catch (e) {
      console.error('❌ Failed to delete goal:', e);
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingIndex = null;
    this.goalLabel = '';
    this.goalValue = 1000;
  }
}
