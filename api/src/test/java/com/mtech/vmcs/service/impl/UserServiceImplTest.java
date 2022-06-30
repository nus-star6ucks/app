package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Machine;
import com.mtech.vmcs.model.entity.User;
import com.mtech.vmcs.model.enums.MachineStatus;
import com.mtech.vmcs.model.enums.UserStatus;
import com.mtech.vmcs.repository.UserRepository;
import com.mtech.vmcs.service.MachineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

  @Mock UserRepository userRepository;

  @Mock MachineService machineService;

  @InjectMocks UserServiceImpl userService;

  User maintainer;

  @BeforeEach
  void setUp() {}

  @Test
  void getAllUsers() {
    when(userRepository.findAll()).thenReturn(Collections.EMPTY_LIST);
    assertNotNull(userService.getAllUsers());
    verify(userRepository, times(1)).findAll();
  }

  @Test
  void createUsers() {
    userService.createUsers(anyList());
    verify(userRepository, times(1)).saveAll(anyIterable());
  }

  @Test
  void updateUsers() {
    userService.updateUsers(anyList());
    verify(userRepository, times(1)).saveAll(anyIterable());
  }

  @Test
  void deleteUsers() {
    userService.deleteUsers(anyList());
    verify(userRepository, times(1)).deleteAllById(anyIterable());
  }

  @Test
  void login() {
    maintainer = new User(76L, "Maintainer", "123891", "logout");
    when(userRepository.findAllByRole("Maintainer"))
        .thenReturn(Collections.singletonList(maintainer));

    // login successfully
    when(userRepository.findById(76L)).thenReturn(Optional.of(maintainer));
    assertTrue(userService.login(maintainer));

    // login failed
    User maintainerWrongPass = new User(76L, "Maintainer", "123456", "logout");
    assertFalse(userService.login(maintainerWrongPass));
  }

  @Test
  void logout() {
    // if door is unlocked.
    Machine machine = new Machine(1L, "VMCS", false, MachineStatus.UNAVAILABLE.toString());
    when(machineService.getAllMachines()).thenReturn(Collections.singletonList(machine));
    assertFalse(userService.logout(maintainer));

    // if door is locked.
    maintainer = new User(76L, "Maintainer", "123891", UserStatus.LOGIN.toString());
    machine.setDoorLocked(true);
    when(userRepository.findById(maintainer.getId())).thenReturn(Optional.of(maintainer));
    assertTrue(userService.logout(maintainer));
    assertEquals(UserStatus.LOGOUT.toString(), maintainer.getStatus());
    assertEquals(MachineStatus.NORMAL.toString(), machine.getStatus());
  }
}
