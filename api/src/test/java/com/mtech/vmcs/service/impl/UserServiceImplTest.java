package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.User;
import com.mtech.vmcs.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    UserServiceImpl userService;

    User maintainer;

    @BeforeEach
    void setUp() {
        maintainer = new User(76L, "Maintainer", "123891", "logout");
        when(userRepository.findAllByRole("Maintainer")).thenReturn(Collections.singletonList(maintainer));

    }

    @Test
    void testLoginSuccess() {
        when(userRepository.findById(76L)).thenReturn(Optional.of(maintainer));
        assertTrue(userService.login(maintainer));
    }

    @Test
    void testLoginFailedIfPasswordNotMatch() {
        User maintainerWrongPass = new User(76L, "Maintainer", "123456", "logout");
        assertFalse(userService.login(maintainerWrongPass));
    }
}