package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.PurchaseOrder;
import com.mtech.vmcs.repository.CoinRepository;
import com.mtech.vmcs.service.CoinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class CoinServiceImpl implements CoinService {

    @Autowired
    private CoinRepository coinRepository;

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
    public Boolean checkCoin(Coin coin) {
        for (Coin everyCoin :
            getAllCoins()) {
            if (everyCoin.getWeight().equals(coin.getWeight()))
                return true;
        }
        return false;
    }

    public Map<String, Object> issueChange(List<Coin> insertedCoins, Integer drinkPrice) {
        // update coin (1)
        Integer totalCoins = 0;

        List<Coin> storedCoins = getAllCoins();
        for (Coin coin : insertedCoins) {
            for (Coin storedCoin : storedCoins) {
                if (storedCoin.getValue().equals(coin.getValue())) {
                    storedCoin.setQuantity(storedCoin.getQuantity() + coin.getQuantity());
                    break;
                }
            }
            totalCoins += coin.getQuantity() * coin.getValue();
        }

        ArrayList<Integer> quantity = new ArrayList<>(); // coin的quantity列表
        ArrayList<Integer> value = new ArrayList<>(); // coin的value列表
        quantity.add(0);
        value.add(0);
        Integer returnCoins = totalCoins - drinkPrice; // 应找回的金额
        for (Coin storedCoin : storedCoins) {
            quantity.add(storedCoin.getQuantity());
            value.add(storedCoin.getValue());
        }

        Integer returnRealCoins = 0;
        ArrayList<Integer> coinIndexList = coinStrategy(returnCoins, quantity, value);

        // update coin (2)
        for (Integer coinIndex : coinIndexList) {
            Integer coinValue = value.get(coinIndex);
            for (Coin storedCoin : storedCoins) {
                if (storedCoin.getValue().equals(coinValue)) {
                    storedCoin.setQuantity(storedCoin.getQuantity() - 1);
                }
            }
            returnRealCoins += coinValue;
        }
        updateCoins(storedCoins);
        Map<String, Object> map = new HashMap<>();
        map.put("collectCoins", returnRealCoins);
        map.put("noChangeAvailable", (returnCoins != returnRealCoins));
        return map;
    }

    private ArrayList<Integer> coinStrategy(
        int returnCoins, ArrayList<Integer> quantity, ArrayList<Integer> value) {
        int coinSize = quantity.size();
        int[] dp = new int[returnCoins + 1];
        int[][] path = new int[coinSize][returnCoins + 1];
        ArrayList<Integer> coinIndexList = new ArrayList<>();
        for (int i = 1; i <= coinSize - 1; i++)
            for (int k = 1; k <= quantity.get(i); k++)
                for (int j = returnCoins; j >= value.get(i); j--)
                    if (dp[j] < dp[j - value.get(i)] + value.get(i)) {
                        dp[j] = dp[j - value.get(i)] + value.get(i);
                        path[i][j] = 1;
                    }

        int i = coinSize - 1, j = returnCoins;
        while (i > 0 && j > 0) {
            if (path[i][j] == 1 && quantity.get(i) != 0) {
                coinIndexList.add(i);
                j -= value.get(i);
                quantity.set(i, quantity.get(i) - 1);
            } else i--;
        }
        return coinIndexList;
    }
}
