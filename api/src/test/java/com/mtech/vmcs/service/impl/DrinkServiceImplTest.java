package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.PurchaseOrder;
import com.mtech.vmcs.repository.DrinkRepository;
import com.mtech.vmcs.service.CoinService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DrinkServiceImplTest {

  private Coin COIN_5C = new Coin(1L, "5c", 5, 1, 1F);
  private Coin COIN_10C = new Coin(2L, "10c", 10, 1, 1F);
  private Coin COIN_20C = new Coin(3L, "20c", 20, 1, 1F);
  private Coin COIN_50C = new Coin(4L, "50c", 50, 1, 1F);
  private Coin COIN_$1 = new Coin(5L, "$1", 100, 1, 1F);
  private static final long DRINK_ID = 1L;
  private Drink drink = new Drink(DRINK_ID, "Coca-Cola", 75, 1, 1);

  List<Coin> storedCoins;

  @Mock
  DrinkRepository drinkRepository;

  @Mock
  CoinService coinService;

  @InjectMocks
  DrinkServiceImpl drinkService;

  @BeforeEach
  void setUp() {
    storedCoins = Arrays.asList(COIN_5C, COIN_10C, COIN_20C, COIN_50C, COIN_$1);
  }

  @Test
  public void testHasEnoughCoins() {
    /*  Stored coins: 5c + 10c + 20c + 50c + $1
     *  Drink price: 75c
     *  Insert coins: $1
     * */

    drink.setPrice(75);
    Map<String, Object> response = purchase();

    // Assert expectedCoinValue = 25 noChangeAvailable = false;
    assertResponse(response, 25, false);
  }

  @Test
  public void testNoChangeNeeded() {
    /*  Stored coins: 5c + 10c + 20c + 50c + $1
     *  Drink price: 100c
     *  Insert coins: $1
     * */

    drink.setPrice(100);
    Map<String, Object> response = purchase();

    assertResponse(response, 0, false);
  }

  @Test
  public void testNoEnoughCoinsOfAppropriateDenominations() {
    /* Stored coins: 10c + 20c + 50c + $1
     *  Drink price: 75
     *  Insert coins: $1
     * */

    COIN_5C.setQuantity(0);
    drink.setPrice(75);
    Map<String, Object> response = purchase();

    assertResponse(response, 20, true);
  }

  private void assertResponse(Map<String, Object> response, int expectedCoinValue, boolean noAppropriateChange) {
    Integer collectCoins = (Integer) response.get("collectCoins");
    Boolean noChangeAvailable = (Boolean) response.get("noChangeAvailable");

    Assertions.assertEquals(expectedCoinValue, collectCoins);
    Assertions.assertEquals(noAppropriateChange, noChangeAvailable);
  }

  private Map<String, Object> purchase() {
    // Mock stored coins and drinks
    when(coinService.getAllCoins()).thenReturn(storedCoins);

    List<Drink> drinks = Collections.singletonList(drink);
    when(drinkRepository.findAll()).thenReturn(drinks);

    // Mock inserted coins

    Coin insertedCoins = new Coin(5L, "$1", 100, 1, 1F);

    // Create purchase order
    PurchaseOrder order = PurchaseOrder.builder()
      .drinkId(DRINK_ID)
      .coins(Collections.singletonList(insertedCoins))
      .build();

    // Purchase
    Map<String, Object> response = drinkService.purchase(order);
    return response;
  }
}
