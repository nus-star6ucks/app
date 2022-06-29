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
import com.mtech.vmcs.service.impl.initialfiledata.IInitialFileDataAdapter;
import com.mtech.vmcs.service.impl.initialfiledata.InitialFileDataBean;
import com.mtech.vmcs.service.impl.initialfiledata.InitialJsonFileDataAdapter;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class MachineServiceImpl implements MachineService {

  @Autowired private MachineRepository machineRepository;
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
    IInitialFileDataAdapter fileDataAdapter = new InitialJsonFileDataAdapter(filePath);
//    or: IInitialFileDataAdapter alternativeFileDataAdapter = new InitialXmlFileDataAdapter(filePath);

    InitialFileDataBean initialFileData = fileDataAdapter.read();

    userService.createUsers(initialFileData.getUsers());
    createMachines(initialFileData.getMachines());
    coinService.createCoins(initialFileData.getCoins());
    drinkService.createDrinks(initialFileData.getDrinks());
  }

  @SneakyThrows
  @Override
  public void stopSimulation(String filePath) {
    IInitialFileDataAdapter fileDataAdapter = new InitialJsonFileDataAdapter(filePath);
//    or: IInitialFileDataAdapter alternativeFileDataAdapter = new InitialXmlFileDataAdapter(filePath);

    InitialFileDataBean initialFileData = new InitialFileDataBean();
    initialFileData.setMachines(getAllMachines());
    initialFileData.setCoins(coinService.getAllCoins());
    initialFileData.setDrinks(drinkService.getAllDrinks());
    initialFileData.setUsers(userService.getAllUsers());

    fileDataAdapter.write(initialFileData);
  }
}
