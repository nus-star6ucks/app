package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.User;
import com.mtech.vmcs.model.enums.UserStatus;
import com.mtech.vmcs.repository.UserRepository;
import com.mtech.vmcs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class UserServiceImpl implements UserService {

  @Autowired private UserRepository userRepository;

  @Override
  public List<User> getAllUsers() {
    return StreamSupport.stream(userRepository.findAll().spliterator(), false)
        .collect(Collectors.toList());
  }

  @Override
  public void createUsers(List<User> users) {
    userRepository.saveAll(users);
  }

  @Override
  public void updateUsers(List<User> users) {
    userRepository.saveAll(users);
  }

  @Override
  public void deleteUsers(List<Long> userIds) {
    userRepository.deleteAllById(userIds);
  }

  @Override
  public Boolean login(User user) {
    if (validateUser(user)) {
      userRepository
          .findById(user.getId())
          .ifPresent(
              u -> {
                u.setStatus(UserStatus.LOGIN.toString());
                userRepository.save(u);
              });
      return true;
    } else {
      return false;
    }
  }

  @Override
  public void logout(User user) {
    userRepository
        .findById(user.getId())
        .ifPresent(
            u -> {
              u.setStatus(UserStatus.LOGOUT.toString());
              userRepository.save(u);
            });
  }

  private Boolean validateUser(User user) {
    return userRepository.findAllByRole(user.getRole()).stream()
        .anyMatch(u -> u.getPassword().equals(user.getPassword()));
  }
}
