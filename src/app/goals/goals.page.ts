import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
  standalone: false
})
export class GoalsPage implements OnInit {

  goalLabel: string = '';
  goalValue: number = 1000;
  goals: { label: string; value: number }[] = [];

  isEditing: boolean = false;
  editingIndex: number | null = null;

  constructor() {}

  ngOnInit() {}

  addGoal() {
    if (!this.goalLabel || !this.goalValue) return;

    if (this.isEditing && this.editingIndex !== null) {
      // Update existing goal
      this.goals[this.editingIndex] = {
        label: this.goalLabel,
        value: this.goalValue
      };
      this.cancelEdit();
    } else {
      // Add new goal
      this.goals.push({
        label: this.goalLabel,
        value: this.goalValue
      });
    }

    this.goalLabel = '';
  }

  editGoal(index: number) {
    this.goalLabel = this.goals[index].label;
    this.goalValue = this.goals[index].value;
    this.isEditing = true;
    this.editingIndex = index;
  }

  deleteGoal(index: number) {
    this.goals.splice(index, 1);
    this.cancelEdit(); // cancel edit if item is deleted while editing
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingIndex = null;
    this.goalLabel = '';
    this.goalValue = 1000;
  }
}
