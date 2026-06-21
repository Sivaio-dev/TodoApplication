package dev.codeio.Todo.service;

import dev.codeio.Todo.models.Todo;
import dev.codeio.Todo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service //bean - an object managed by spring
public class TodoService {
    @Autowired //autowire
    private TodoRepository todoRepository;

    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public Todo getTodoById(Long id) {
        return todoRepository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found!"));
    }

    public Page<Todo> getAllTodoPages(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        return todoRepository.findAll(pageable);
    }

    public List<Todo> getTodos() {
        return todoRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Todo::getId))
                .toList();
    }

    public Todo updateTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public void deleteTodoById(Long id) {
        todoRepository.delete(getTodoById(id));
    }

    public void deleteTodo(Todo todo) {
        todoRepository.delete(todo);
    }
}
