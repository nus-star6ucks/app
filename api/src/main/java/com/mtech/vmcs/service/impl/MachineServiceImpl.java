package com.mtech.vmcs.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.Machine;
import com.mtech.vmcs.model.entity.User;
import com.mtech.vmcs.repository.MachineRepository;
import com.mtech.vmcs.service.CoinService;
import com.mtech.vmcs.service.DrinkService;
import com.mtech.vmcs.service.MachineService;
import com.mtech.vmcs.service.UserService;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class MachineServiceImpl implements MachineService {

  @Autowired private MachineRepository machineRepository;
  @Autowired private ObjectMapper objectMapper;
  @Autowired @Lazy private UserService userService;
  @Autowired @Lazy private DrinkService drinkService;
  @Autowired @Lazy private CoinService coinService;

  @Override
  public List<Machine> getAllMachines() {
    return StreamSupport.stream(machineRepository.findAll().spliterator(), false)
        .collect(Collectors.toList());
  }

  @Override
  public void createMachines(List<Machine> machines) {
    machineRepository.saveAll(machines);
  }

  @Override
  public void updateMachines(List<Machine> machines) {
    machineRepository.saveAll(machines);
  }

  @Override
  public void deleteMachines(List<Long> machineIds) {
    machineRepository.deleteAllById(machineIds);
  }

  @SneakyThrows
  @Override
  public void startSimulation(String filePath) {
    JsonNode jsonNode = objectMapper.readTree(new File(filePath));
    List<User> users = objectMapper.readerForListOf(User.class).readValue(jsonNode.get("users"));
    List<Machine> machines =
        objectMapper.readerForListOf(Machine.class).readValue(jsonNode.get("machines"));
    List<Coin> coins = objectMapper.readerForListOf(Coin.class).readValue(jsonNode.get("coins"));
    List<Drink> drinks =
        objectMapper.readerForListOf(Drink.class).readValue(jsonNode.get("drinks"));

    userService.createUsers(users);
    createMachines(machines);
    coinService.createCoins(coins);
    drinkService.createDrinks(drinks);
  }

  @SneakyThrows
  @Override
  public void stopSimulation(String filePath) {
    ObjectNode objectNode = objectMapper.createObjectNode();
    objectNode.set("users", objectMapper.valueToTree(userService.getAllUsers()));
    objectNode.set("machines", objectMapper.valueToTree(getAllMachines()));
    objectNode.set("coins", objectMapper.valueToTree(coinService.getAllCoins()));
    objectNode.set("drinks", objectMapper.valueToTree(drinkService.getAllDrinks()));
    objectMapper.writeValue(new File(filePath), objectNode);
  }
}
