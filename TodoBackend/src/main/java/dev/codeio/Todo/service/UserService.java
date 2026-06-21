package dev.codeio.Todo.service;

import dev.codeio.Todo.models.User;
import dev.codeio.Todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service //bean - an object managed by spring
public class UserService {
    @Autowired //autowire
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found!"));
    }
}
