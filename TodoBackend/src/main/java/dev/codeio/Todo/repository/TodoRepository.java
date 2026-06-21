package dev.codeio.Todo.repository;

import dev.codeio.Todo.models.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

// CRUD
public interface TodoRepository extends JpaRepository<Todo, Long> {

}
