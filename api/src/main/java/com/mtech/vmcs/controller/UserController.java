package com.mtech.vmcs.controller;

import com.mtech.vmcs.model.entity.User;
import com.mtech.vmcs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(path = "/users")
public class UserController {

  @Autowired private UserService userService;

  @GetMapping
  public ResponseEntity<List<User>> getAllUsers() {
    return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
  }

  @PostMapping
  public ResponseEntity<List<User>> createUsers(@RequestBody List<User> users) {
    userService.createUsers(users);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @PostMapping("/login")
  public ResponseEntity<User> login(@RequestBody User user) {
    if (userService.login(user)) {
      return new ResponseEntity<>(HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<User> logout(@RequestBody User user) {
    userService.logout(user);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PutMapping
  public ResponseEntity<List<User>> updateUsers(@RequestBody List<User> users) {
    userService.updateUsers(users);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping
  public ResponseEntity<List<Long>> deleteUsers(@RequestBody List<Long> userIds) {
    userService.deleteUsers(userIds);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
