package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.repository.DrinkRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DrinkServiceImplTest {
  @Mock DrinkRepository drinkRepository;
  @InjectMocks DrinkServiceImpl drinkService;

  @Test
  void getDrinksByName() {
    drinkService.getDrinksByName(anyString());
    verify(drinkRepository, times(1)).findAllByName(anyString());
  }

  @Test
  void getAllDrinks() {
    when(drinkRepository.findAll()).thenReturn(Collections.EMPTY_LIST);
    assertNotNull(drinkService.getAllDrinks());
    verify(drinkRepository, times(1)).findAll();
  }

  @Test
  void createDrinks() {
    drinkService.createDrinks(anyList());
    verify(drinkRepository, times(1)).saveAll(anyIterable());
  }

  @Test
  void updateDrinks() {
    drinkService.updateDrinks(anyList());
    verify(drinkRepository, times(1)).saveAll(anyIterable());
  }

  @Test
  void deleteDrinks() {
    drinkService.deleteDrinks(anyList());
    verify(drinkRepository, times(1)).deleteAllById(anyIterable());
  }
}
