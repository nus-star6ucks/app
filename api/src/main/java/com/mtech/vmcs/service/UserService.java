package com.mtech.vmcs.service;

import com.mtech.vmcs.model.entity.User;

import java.util.List;

public interface UserService {

  List<User> getAllUsers();

  void createUsers(List<User> users);

  void updateUsers(List<User> users);

  void deleteUsers(List<Long> userIds);

  Boolean login(User user);

  Boolean logout(User user);
}
