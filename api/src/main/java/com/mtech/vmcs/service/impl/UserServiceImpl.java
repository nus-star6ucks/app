package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Machine;
import com.mtech.vmcs.model.entity.User;
import com.mtech.vmcs.model.enums.MachineStatus;
import com.mtech.vmcs.model.enums.UserStatus;
import com.mtech.vmcs.repository.UserRepository;
import com.mtech.vmcs.service.MachineService;
import com.mtech.vmcs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class UserServiceImpl implements UserService {

  @Autowired private UserRepository userRepository;
  @Autowired private MachineService machineService;

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
      // unlock door
      List<Machine> machines = machineService.getAllMachines();
      for (Machine machine : machines) {
        machine.setDoorLocked(false);
        machine.setStatus(MachineStatus.UNAVAILABLE.toString());
      }
      machineService.updateMachines(machines);
      return true;
    } else {
      return false;
    }
  }

  @Override
  public Boolean logout(User user) {

    List<Machine> machines = machineService.getAllMachines();
    for (Machine machine : machines) {
      if (!machine.getDoorLocked()) return false;
      machine.setStatus(MachineStatus.NORMAL.toString());
    }
    userRepository
        .findById(user.getId())
        .ifPresent(
            u -> {
              u.setStatus(UserStatus.LOGOUT.toString());
              userRepository.save(u);
            });
    machineService.updateMachines(machines);
    return true;
  }

  private Boolean validateUser(User user) {
    return userRepository.findAllByRole(user.getRole()).stream()
        .anyMatch(u -> u.getPassword().equals(user.getPassword()));
  }
}
