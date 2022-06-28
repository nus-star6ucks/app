package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.PurchaseOrder;
import com.mtech.vmcs.repository.DrinkRepository;
import com.mtech.vmcs.service.CoinService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DrinkServiceImplTest {

  private static final Coin COIN_5C = new Coin(1L, "5c", 5, 1, 1F);
  private static final Coin COIN_10C = new Coin(10L, "10c", 10, 1, 1F);
  private static final Coin COIN_20C = new Coin(20L, "20c", 20, 1, 1F);
  private static final Coin COIN_$1 = new Coin(100L, "100c", 100, 1, 1F);
  private static final long DRINK_ID = 1L;
  private Drink drink = new Drink(DRINK_ID, "Coca-Cola", 75, 1, 1);

  @Mock
  DrinkRepository drinkRepository;

  @Mock
  CoinService coinService;

  @InjectMocks
  DrinkServiceImpl drinkService;

  @Test
  public void testHasEnoughCoins() {
    /* Stored coins: 5c + 20c
     *  Drink price: 75c
     *  Insert coins: $1
     * */

    List<Coin> storedCoins = Arrays.asList(COIN_5C, COIN_20C);

    Map<String, Object> response = purchase(storedCoins);

    assertResponse(response, 25, true);
  }

  @Test
  public void testNoChangeNeeded() {
    /* Stored coins: 0c
     *  Drink price: 100c
     *  Insert coins: $1
     * */

    List<Coin> storedCoins = Collections.emptyList();
    drink.setPrice(100);

    Map<String, Object> response = purchase(storedCoins);

    assertResponse(response, 0, false);
  }

  @Test
  public void testNotEnoughCoins() {
    /* Stored coins: 5c
     *  Drink price: 75c
     *  Insert coins: $1
     * */

    List<Coin> storedCoins = Collections.singletonList(COIN_5C);

    Map<String, Object> response = purchase(storedCoins);

    assertResponse(response, 5, true);
  }

  @Test
  public void testNoEnoughCoinsOfAppropriateDenominations() {
    /* Stored coins: 10c + 20c
     *  Drink price: 75c
     *  Insert coins: $1
     * */

    List<Coin> storedCoins = Arrays.asList(COIN_10C, COIN_20C);

    Map<String, Object> response = purchase(storedCoins);

    assertResponse(response, 20, true);
  }

  private void assertResponse(Map<String, Object> response, int expectedCoinValue, boolean expectedChange) {
    Integer collectCoins = (Integer) response.get("collectCoins");
    Boolean noChangeAvailable = (Boolean) response.get("noChangeAvailable");

    Assertions.assertEquals(expectedCoinValue, collectCoins);
    Assertions.assertEquals(expectedChange, noChangeAvailable);
  }

  private Map<String, Object> purchase(List<Coin> storedCoins) {
    // Mock stored coins and drinks
    when(coinService.getAllCoins()).thenReturn(storedCoins);

    List<Drink> drinks = Collections.singletonList(drink);
    when(drinkRepository.findAll()).thenReturn(drinks);

    // Mock inserted coins
    List<Coin> insertedCoins = Collections.singletonList(COIN_$1);

    // Create purchase order
    PurchaseOrder order = PurchaseOrder.builder()
      .drinkId(DRINK_ID)
      .coins(insertedCoins)
      .build();

    // Purchase
    Map<String, Object> response = drinkService.purchase(order);
    return response;
  }
}
