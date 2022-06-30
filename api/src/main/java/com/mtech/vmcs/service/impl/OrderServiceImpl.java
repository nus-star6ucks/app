package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.PurchaseOrder;
import com.mtech.vmcs.repository.DrinkRepository;
import com.mtech.vmcs.service.CoinService;
import com.mtech.vmcs.service.DrinkService;
import com.mtech.vmcs.service.OrderService;
import com.mtech.vmcs.utill.MementoStack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

  private static final MementoStack<PurchaseOrder> mementoStack = new MementoStack<>();

  @Autowired private CoinService coinService;

  @Autowired private DrinkService drinkService;

  @Autowired private DrinkRepository drinkRepository;

  @Override
  public Map<String, Object> purchase(PurchaseOrder purchaseOrder) {
    List<Drink> drinks = drinkService.getAllDrinks();
    Long drinkId = purchaseOrder.getDrinkId();

    // Save the status before purchase.
    storeRecord(drinkId);

    Integer drinkPrice = 0;

    // update drink
    for (Drink drink : drinks) {
      if (drink.getId().equals(drinkId)) {
        drink.setQuantity(drink.getQuantity() - 1);
        drinkPrice = drink.getPrice();
        break;
      }
    }
    drinkService.updateDrinks(drinks);

    List<Coin> coins = purchaseOrder.getCoins();

    return coinService.issueChange(coins, drinkPrice);
  }

  @Override
  public void undoPurchase() {
    PurchaseOrder snapshot = mementoStack.pop();
    drinkRepository
        .findById(snapshot.getDrinkId())
        .ifPresent(
            drink -> {
              drink.setQuantity(drink.getQuantity() + 1);
              drinkService.updateDrinks(Collections.singletonList(drink));
            });
    coinService.updateCoins(snapshot.getCoins());
  }

  private void storeRecord(Long drinkId) {

    PurchaseOrder snapshot = new PurchaseOrder();
    snapshot.setDrinkId(drinkId);

    // record the stock of coin before purchase.(deep copy)
    snapshot.setCoins(
        coinService.getAllCoins().stream()
            .map(
                coin ->
                    new Coin(
                        coin.getId(),
                        coin.getName(),
                        coin.getValue(),
                        coin.getQuantity(),
                        coin.getWeight()))
            .collect(Collectors.toList()));

    // ensure that only the latest record will be stored.
    mementoStack.clear();
    mementoStack.push(snapshot);
  }

  public MementoStack<PurchaseOrder> getMementoStack() {
    return mementoStack;
  }
}
