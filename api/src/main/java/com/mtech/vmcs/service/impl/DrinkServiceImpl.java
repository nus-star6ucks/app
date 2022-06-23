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
    Integer drinkPrice = 0; // 购买饮料的价格
    Integer totalCoins = 0; // 投入的硬币总金额

    //更新drink
    for (Drink drink: drinks) {
      if (drink.getId().equals(drinkId)) {
        drink.setQuantity(drink.getQuantity() - 1);
        drinkPrice = drink.getPrice();
        break;
      }
    }
    updateDrinks(drinks);

    //第一次更新coin
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
    Integer returnCoins = totalCoins - drinkPrice; //应找回的金额
    for(Coin storedCoin: storedCoins){
      quantity.add(storedCoin.getQuantity());
      value.add(storedCoin.getValue());
    }

    // todo:找出最优解
    int[] dp = new int[returnCoins + 1];
    for (int i = 0; i < storedCoins.size(); i++){
      for(int j = returnCoins; j >= 1; j--){
        for(int k = 0; k <= quantity.get(i) && j >= k; k++){
          dp[j] = Math.max(dp[j], dp[j - k] + k * value.get(i));
        }
      }
    }

    //todo:设置storedCoins

    //第二次更新coin
    coinService.updateCoins(storedCoins);
    Map<String, Object> map = new HashMap<>();
    map.put("collectCoins", dp[returnCoins]);
    map.put("noChangeAvailable", (dp[returnCoins] != 0));
    return map;
  }
}
