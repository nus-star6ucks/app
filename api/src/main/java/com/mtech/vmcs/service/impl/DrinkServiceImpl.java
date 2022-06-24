package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.PurchaseOrder;
import com.mtech.vmcs.repository.DrinkRepository;
import com.mtech.vmcs.service.CoinService;
import com.mtech.vmcs.service.DrinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class DrinkServiceImpl implements DrinkService {

  @Autowired private DrinkRepository drinkRepository;
  @Autowired private CoinService coinService;

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
  public Map<String, Object> purchase(PurchaseOrder purchaseOrder){
    List<Drink> drinks = getAllDrinks();
    Long drinkId = purchaseOrder.getDrinkId();
    Integer drinkPrice = 0;
    Integer totalCoins = 0;

    //update drink
    for (Drink drink: drinks) {
      if (drink.getId().equals(drinkId)) {
        drink.setQuantity(drink.getQuantity() - 1);
        drinkPrice = drink.getPrice();
        break;
      }
    }
    updateDrinks(drinks);

    //update coin (1)
    List<Coin> coins = purchaseOrder.getCoins();
    List<Coin> storedCoins = coinService.getAllCoins();
    for(Coin coin: coins){
      for(Coin storedCoin: storedCoins) {
        if (storedCoin.getValue().equals(coin.getValue())) {
          storedCoin.setQuantity(storedCoin.getQuantity() + coin.getQuantity());
          break;
        }
      }
      totalCoins += coin.getQuantity() * coin.getValue();
    }

    ArrayList<Integer> quantity = new ArrayList<>(); //coin的quantity列表
    ArrayList<Integer> value = new ArrayList<>(); //coin的value列表
    quantity.add(0);
    value.add(0);
    Integer returnCoins = totalCoins - drinkPrice; //应找回的金额
    for(Coin storedCoin: storedCoins){
      quantity.add(storedCoin.getQuantity());
      value.add(storedCoin.getValue());
    }

    Integer returnRealCoins = 0;
    ArrayList<Integer> coinIndexList = coinStrategy(returnCoins, quantity, value);

    //update coin (2)
    for(Integer coinIndex: coinIndexList){
      Integer coinValue = value.get(coinIndex);
      for(Coin storedCoin: storedCoins){
        if (storedCoin.getValue().equals(coinValue)){
          storedCoin.setQuantity(storedCoin.getQuantity()-1);
        }
      }
      returnRealCoins += coinValue;
    }
    coinService.updateCoins(storedCoins);
    Map<String, Object> map = new HashMap<>();
    map.put("collectCoins", returnRealCoins);
    map.put("noChangeAvailable", (returnCoins != returnRealCoins));
    return map;
  }

  protected ArrayList<Integer> coinStrategy(int returnCoins, ArrayList<Integer> quantity, ArrayList<Integer> value){
    int coinSize = quantity.size();
    int[] dp = new int[returnCoins + 1];
    int[][] path = new int[coinSize][returnCoins+1];
    ArrayList<Integer> coinIndexList = new ArrayList<>();
    for (int i = 1; i <= coinSize-1; i++)
      for (int k = 1; k <= quantity.get(i); k++)
        for (int j = returnCoins; j >= value.get(i); j--)
          if (dp[j] < dp[j - value.get(i)] + value.get(i))
          {
            dp[j] = dp[j - value.get(i)] + value.get(i);
            path[i][j] = 1;
          }

    int i = coinSize-1, j = returnCoins;
    while (i > 0 && j > 0)
    {
      if (path[i][j] == 1 && quantity.get(i) != 0)
      {
        coinIndexList.add(i);
        j -= value.get(i);
        quantity.set(i, quantity.get(i)-1);
      }
      else
        i--;
    }
    return coinIndexList;
  }
}
