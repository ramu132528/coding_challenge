package com.example.Task.service;

import com.example.Task.entity.Task;

import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<Task> getAllTasks();
    Optional<Task> getTaskById(Long id);
    Task addTask(Task task);
    Optional<Task> updateTask(Long id, Task updatedTask);
    boolean deleteTask(Long id);
}
