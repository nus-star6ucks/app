package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.repository.CoinRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CoinServiceImplTest {

  @Mock CoinRepository coinRepository;

  @InjectMocks CoinServiceImpl coinService;

  @Test
  void getAllCoins() {
    List<Coin> coins = Collections.singletonList(new Coin(123L, "Fanta", 85, 20, 1F));

    when(coinRepository.findAll()).thenReturn(coins);

    List<Coin> coinList = coinService.getAllCoins();

    assertEquals(1, coinList.size());
    assertEquals("Fanta", coinList.get(0).getName());

    verify(coinRepository, times(1)).findAll();
  }

  @Test
  void createCoins() {}

  @Test
  void updateCoins() {}

  @Test
  void deleteCoins() {}

  @Test
  void checkCoin() {}
}
