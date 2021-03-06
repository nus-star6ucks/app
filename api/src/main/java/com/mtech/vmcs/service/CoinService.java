package com.mtech.vmcs.service;

import com.mtech.vmcs.model.entity.Coin;

import java.util.List;
import java.util.Map;

public interface CoinService {

  List<Coin> getAllCoins();

  void createCoins(List<Coin> coins);

  void updateCoins(List<Coin> coins);

  void deleteCoins(List<Long> coinIds);

  Boolean checkCoin(Coin coin);

  Map<String, Object> issueChange(List<Coin> coins, Integer drinkPrice);
}
