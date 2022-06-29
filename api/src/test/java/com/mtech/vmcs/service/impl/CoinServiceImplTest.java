package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.repository.CoinRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class CoinServiceImplTest {

    private Coin COIN_5C = new Coin(1L, "5c", 5, 1, 1F);
    private Coin COIN_10C = new Coin(2L, "10c", 10, 1, 1F);
    private Coin COIN_20C = new Coin(3L, "20c", 20, 1, 1F);
    private Coin COIN_50C = new Coin(4L, "50c", 50, 1, 1F);
    private Coin COIN_$1 = new Coin(5L, "$1", 100, 1, 1F);
    List<Coin> storedCoins;
    List<Coin> insertedCoins;
    @Mock
    CoinRepository coinRepository;
    @InjectMocks
    CoinServiceImpl coinService;

    @Test
    public void testHasEnoughCoins() {
        /*  Stored coins: 5c + 10c + 20c + 50c + $1
         *  Drink price: 75c
         *  Insert coins: $1
         * */
        mockData();
        Map<String, Object> response = coinService.issueChange(insertedCoins, 75);

        // Assert expectedCoinValue = 25 noChangeAvailable = false;
        assertResponse(response, 25, false);
    }

    @Test
    public void testNoChangeNeeded() {
        /*  Stored coins: 5c + 10c + 20c + 50c + $1
         *  Drink price: 100c
         *  Insert coins: $1
         * */
        mockData();
        Map<String, Object> response = coinService.issueChange(insertedCoins, 100);

        assertResponse(response, 0, false);
    }

    @Test
    public void testNoEnoughCoinsOfAppropriateDenominations() {
        /* Stored coins: 10c + 20c + 50c + $1
         *  Drink price: 75
         *  Insert coins: $1
         * */

        COIN_5C.setQuantity(0);
        mockData();

        Map<String, Object> response = coinService.issueChange(insertedCoins, 75);

        assertResponse(response, 20, true);
    }

    @Test
    public void testGetCoins() {
        List<Coin> coins = Collections.singletonList(new Coin(123L, "Fanta", 85, 20, 1F));

        when(coinRepository.findAll()).thenReturn(coins);

        List<Coin> coinList = coinService.getAllCoins();

        assertEquals(1, coinList.size());
        assertEquals("Fanta", coinList.get(0).getName());

        verify(coinRepository, times(1)).findAll();
    }

    private void mockData() {
        // Mock stored coins and drinks
        storedCoins = Arrays.asList(COIN_5C, COIN_10C, COIN_20C, COIN_50C, COIN_$1);
        when(coinRepository.findAll()).thenReturn(storedCoins);

        // Mock inserted coins
        Coin insertedCoin = new Coin(5L, "$1", 100, 1, 1F);
        insertedCoins = Collections.singletonList(insertedCoin);
    }

    private void assertResponse(Map<String, Object> response, int expectedCoinValue, boolean noAppropriateChange) {
        Integer collectCoins = (Integer) response.get("collectCoins");
        Boolean noChangeAvailable = (Boolean) response.get("noChangeAvailable");

        assertEquals(expectedCoinValue, collectCoins);
        assertEquals(noAppropriateChange, noChangeAvailable);
    }
}
