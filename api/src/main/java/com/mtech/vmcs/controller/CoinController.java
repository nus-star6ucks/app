package com.mtech.vmcs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.service.CoinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@Controller
@RequestMapping(path = "/coins")
public class CoinController {

  @Autowired private CoinService coinService;
  @Autowired private ObjectMapper objectMapper;

  @GetMapping
  public ResponseEntity<List<Coin>> getAllCoins() {
    return new ResponseEntity<>(coinService.getAllCoins(), HttpStatus.OK);
  }

  @PostMapping
  public ResponseEntity<List<Coin>> createCoins(@RequestBody List<Coin> coins) {
    coinService.createCoins(coins);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @PostMapping("/checkCoin")
  public ResponseEntity checkCoin(@RequestBody Coin coin) throws IllegalAccessException {
    ObjectNode objectNode = objectMapper.valueToTree(coin);
    objectNode.put("isValid", coinService.checkCoin(coin));
    return new ResponseEntity<>(objectNode, HttpStatus.OK);
  }

  @PutMapping
  public ResponseEntity<List<Coin>> updateCoins(@RequestBody List<Coin> coins) {
    coinService.updateCoins(coins);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping
  public ResponseEntity<List<Long>> deleteCoins(@RequestBody List<Long> coinIds) {
    coinService.deleteCoins(coinIds);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
