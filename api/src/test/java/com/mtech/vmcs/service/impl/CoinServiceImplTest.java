package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.repository.CoinRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


@SpringBootTest
class CoinServiceImplTest {

    @Mock
    CoinRepository coinRepository;

    @InjectMocks
    CoinServiceImpl coinService;

    @Test
    public void testGetCoins() {
        List<Coin> coins = Arrays.asList(new Coin(123L, "Fanta", 85, 20, 1F));

        when(coinRepository.findAll()).thenReturn(coins);

        List<Coin> coinList = coinService.getAllCoins();

        assertEquals(1, coinList.size());
        assertEquals("Fanta", coinList.get(0).getName());

        verify(coinRepository, times(1)).findAll();
    }
}