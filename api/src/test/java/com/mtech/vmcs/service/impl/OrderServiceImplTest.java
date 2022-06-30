package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.PurchaseOrder;
import com.mtech.vmcs.repository.DrinkRepository;
import com.mtech.vmcs.service.CoinService;
import com.mtech.vmcs.service.DrinkService;
import com.mtech.vmcs.utill.MementoStack;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

  @Mock CoinService coinService;
  @Mock DrinkService drinkService;
  @Mock DrinkRepository drinkRepository;
  @InjectMocks OrderServiceImpl orderService;

  @Test
  void purchase() {}

  @Test
  void undoPurchase() {
    MementoStack<PurchaseOrder> mementoStack = orderService.getMementoStack();
    PurchaseOrder purchaseOrder = new PurchaseOrder();
    List<Coin> coins = new ArrayList<>();
    coins.add(new Coin(27L, "5c", 5, 0, 1F));
    Drink drink = new Drink(1L, "Coca-Cola", 75, 4, 1);
    purchaseOrder.setDrinkId(1L);
    purchaseOrder.setCoins(coins);
    mementoStack.push(purchaseOrder);
    when(drinkRepository.findById(anyLong())).thenReturn(Optional.of(drink));
    orderService.undoPurchase();
    verify(drinkService, times(1)).updateDrinks(anyList());
    verify(coinService, times(1)).updateCoins(anyList());
    assertEquals(5, drink.getQuantity());
  }
}
