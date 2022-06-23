package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.repository.CoinRepository;
import com.mtech.vmcs.service.CoinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class CoinServiceImpl implements CoinService {

  @Autowired private CoinRepository coinRepository;

  @Override
  public List<Coin> getAllCoins() {
    return StreamSupport.stream(coinRepository.findAll().spliterator(), false)
        .collect(Collectors.toList());
  }

  @Override
  public void createCoins(List<Coin> coins) {
    coinRepository.saveAll(coins);
  }

  @Override
  public void updateCoins(List<Coin> coins) {
    coinRepository.saveAll(coins);
  }

  @Override
  public void deleteCoins(List<Long> coinIds) {
    coinRepository.deleteAllById(coinIds);
  }

  @Override
  public Boolean checkCoin(Coin coin){
    for (Coin everyCoin:
         getAllCoins()) {
      if (everyCoin.getValue().equals(coin.getValue()))
        return true;
    }
    return false;
  }
}
