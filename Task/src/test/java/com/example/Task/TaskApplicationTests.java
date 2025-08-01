package com.example.Task;

import com.example.Task.Controller.TaskRestController;
import com.example.Task.entity.Task;
import com.example.Task.enums.Priority;
import com.example.Task.enums.Status;
import com.example.Task.repository.TaskRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class TaskApplicationTests {

    @Autowired
    private TaskRestController controller;

    @Autowired
    private TaskRepository repository;

    static Long taskId;

    @Test
    @Order(1)
    public void testAddTask() {
        Task task = new Task();
        task.setTitle("Test Task");
        task.setDescription("Description");
        task.setDueDate(LocalDate.of(2025, 7, 1));
        task.setPriority(Priority.MEDIUM);
        task.setStatus(Status.PENDING);

        Task saved = controller.addTask(task);
        assertNotNull(saved);
        assertNotNull(saved.getTaskId());
        taskId = saved.getTaskId();
    }

    @Test
    @Order(2)
    public void testGetAllTasks() {
        List<Task> tasks = controller.getAllTasks();
        assertFalse(tasks.isEmpty());
    }

    @Test
    @Order(3)
    public void testGetTaskById() {
        ResponseEntity<Task> response = controller.getTaskById(taskId);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Test Task", response.getBody().getTitle());
    }

    @Test
    @Order(4)
    public void testUpdateTask() {
        Task updated = new Task();
        updated.setTitle("Updated Task");
        updated.setDescription("Updated Desc");
        updated.setDueDate(LocalDate.of(2025, 8, 1));
        updated.setPriority(Priority.HIGH);
        updated.setStatus(Status.COMPLETED);

        ResponseEntity<Task> response = controller.updateTask(taskId, updated);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Updated Task", response.getBody().getTitle());
    }

    @Test
    @Order(5)
    public void testDeleteTask() {
        ResponseEntity<String> response = controller.deleteTask(taskId);
        assertEquals(200, response.getStatusCodeValue());

        Optional<Task> deleted = repository.findById(taskId);
        assertTrue(deleted.isEmpty());
    }

    @Test
    @Order(6)
    public void testGetTaskById_NotFound() {
        ResponseEntity<Task> response = controller.getTaskById(999L);
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    @Order(7)
    public void testUpdateTask_NotFound() {
        Task dummy = new Task();
        dummy.setTitle("Dummy");
        dummy.setDescription("Not Exist");
        dummy.setDueDate(LocalDate.now());
        dummy.setPriority(Priority.LOW);
        dummy.setStatus(Status.PENDING);

        ResponseEntity<Task> response = controller.updateTask(999L, dummy);
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    @Order(8)
    public void testDeleteTask_NotFound() {
        ResponseEntity<String> response = controller.deleteTask(999L);
        assertEquals(404, response.getStatusCodeValue());
    }
}
