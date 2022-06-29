package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.PurchaseOrder;
import com.mtech.vmcs.repository.DrinkRepository;
import com.mtech.vmcs.service.CoinService;
import com.mtech.vmcs.service.DrinkService;
import com.mtech.vmcs.utill.MementoStack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class DrinkServiceImpl implements DrinkService {

  private static final MementoStack<PurchaseOrder> mementoStack = new MementoStack<>();
  @Autowired
  private DrinkRepository drinkRepository;
  @Autowired
  private CoinService coinService;

  @Override
  public List<Drink> getDrinksByName(String name) {
    return drinkRepository.findAllByName(name);
  }

  @Override
  public List<Drink> getAllDrinks() {
    return StreamSupport.stream(drinkRepository.findAll().spliterator(), false)
      .collect(Collectors.toList());
  }

  @Override
  public void createDrinks(List<Drink> drinks) {
    drinkRepository.saveAll(drinks);
  }

  @Override
  public void updateDrinks(List<Drink> drinks) {
    drinkRepository.saveAll(drinks);
  }

  @Override
  public void deleteDrinks(List<Long> drinkIds) {
    drinkRepository.deleteAllById(drinkIds);
  }

  @Override
  public Map<String, Object> purchase(PurchaseOrder purchaseOrder) {
    List<Drink> drinks = getAllDrinks();
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
    updateDrinks(drinks);

    List<Coin> insertedCoins = purchaseOrder.getCoins();

    return coinService.issueChange(insertedCoins, drinkPrice);
  }


  @Override
  public void undoPurchase() {
    PurchaseOrder snapshot = mementoStack.pop();
    drinkRepository
      .findById(snapshot.getDrinkId())
      .ifPresent(
        drink -> {
          drink.setQuantity(drink.getQuantity() + 1);
          updateDrinks(Collections.singletonList(drink));
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
}
