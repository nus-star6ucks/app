package com.mtech.vmcs.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.Machine;
import com.mtech.vmcs.model.entity.User;
import com.mtech.vmcs.repository.MachineRepository;
import com.mtech.vmcs.service.impl.initialfiledata.InitialFileDataBean;
import com.mtech.vmcs.service.impl.initialfiledata.InitialJsonFileDataAdapter;
import com.mtech.vmcs.service.impl.initialfiledata.InitialYamlFileDataAdapter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;


@ExtendWith(MockitoExtension.class)
class MachineServiceImplTest {

  @Mock
  MachineRepository machineRepository;

  @InjectMocks
  MachineServiceImpl machineService;

  @AfterEach
  public void deleteTempFiles() throws IOException {
    File tempJsonFile = new File("test_init_file.json");
    File tempYamlFile = new File("test_init_file.yaml");
    Files.deleteIfExists(tempJsonFile.toPath());
    Files.deleteIfExists(tempYamlFile.toPath());
  }

  @Test
  public void whenGotFromYamlInitialFile_thenReadCorrect() throws IOException {
    final String testFilePath = "test_init_file.yaml";

    File yamlOutput = new File(testFilePath);
    FileWriter fileWriter = new FileWriter(yamlOutput);
    fileWriter.write("---\n" +
      "users:\n" +
      "- id: 25\n" +
      "  role: \"Maintainer\"\n" +
      "  password: \"123891\"\n" +
      "  status: \"logout\"\n" +
      "machines:\n" +
      "- id: 26\n" +
      "  name: \"Star6ucks\"\n" +
      "  doorLocked: true\n" +
      "  status: \"normal\"\n" +
      "drinks:\n" +
      "- id: 32\n" +
      "  name: \"Coca-Cola\"\n" +
      "  price: 75\n" +
      "  quantity: 4\n" +
      "  slotNum: 1\n" +
      "- id: 33\n" +
      "  name: \"Fanta\"\n" +
      "  price: 89\n" +
      "  quantity: 7\n" +
      "  slotNum: 2\n" +
      "coins:\n" +
      "- id: 27\n" +
      "  name: \"5c\"\n" +
      "  value: 5\n" +
      "  quantity: 0\n" +
      "  weight: 1.0\n" +
      "- id: 28\n" +
      "  name: \"10c\"\n" +
      "  value: 10\n" +
      "  quantity: 0\n" +
      "  weight: 1.0\n");
    fileWriter.close();

    InitialYamlFileDataAdapter fileDataAdapter = new InitialYamlFileDataAdapter(testFilePath);
    InitialFileDataBean initialFileData = fileDataAdapter.read();

    final ObjectMapper mapper = new ObjectMapper();

    assertEquals(
      mapper.writeValueAsString(initialFileData.getUsers()),
      mapper.writeValueAsString(Collections.singletonList(new User(25L, "Maintainer", "123891", "logout")))
    );
    assertEquals(
      mapper.writeValueAsString(initialFileData.getMachines()),
      mapper.writeValueAsString(Collections.singletonList(new Machine(26L, "Star6ucks", true, "normal")))
    );
    assertEquals(
      mapper.writeValueAsString(initialFileData.getCoins()),
      mapper.writeValueAsString(Arrays.asList(new Coin(27L, "5c", 5, 0, 1F), new Coin(28L, "10c", 10, 0, 1F)))
    );
    assertEquals(
      mapper.writeValueAsString(initialFileData.getDrinks()),
      mapper.writeValueAsString(Arrays.asList(new Drink(32L, "Coca-Cola", 75, 4, 1), new Drink(33L, "Fanta", 89, 7, 2)))
    );
  }

  @Test
  public void whenGotFromYamlInitialFile_thenWriteCorrect() throws IOException {
    final String testFilePath = "test_init_file.yaml";
    final String expectedOutput = "---\n" +
      "users:\n" +
      "- id: 25\n" +
      "  role: \"Maintainer\"\n" +
      "  password: \"123891\"\n" +
      "  status: \"logout\"\n" +
      "machines:\n" +
      "- id: 26\n" +
      "  name: \"Star6ucks\"\n" +
      "  doorLocked: true\n" +
      "  status: \"normal\"\n" +
      "drinks:\n" +
      "- id: 32\n" +
      "  name: \"Coca-Cola\"\n" +
      "  price: 75\n" +
      "  quantity: 4\n" +
      "  slotNum: 1\n" +
      "- id: 33\n" +
      "  name: \"Fanta\"\n" +
      "  price: 89\n" +
      "  quantity: 7\n" +
      "  slotNum: 2\n" +
      "coins:\n" +
      "- id: 27\n" +
      "  name: \"5c\"\n" +
      "  value: 5\n" +
      "  quantity: 0\n" +
      "  weight: 1.0\n" +
      "- id: 28\n" +
      "  name: \"10c\"\n" +
      "  value: 10\n" +
      "  quantity: 0\n" +
      "  weight: 1.0\n";
    InitialYamlFileDataAdapter fileDataAdapter = new InitialYamlFileDataAdapter(testFilePath);
    InitialFileDataBean initialFileData = new InitialFileDataBean();

    initialFileData.setUsers(Collections.singletonList(new User(25L, "Maintainer", "123891", "logout")));
    initialFileData.setMachines(Collections.singletonList(new Machine(26L, "Star6ucks", true, "normal")));
    initialFileData.setCoins(Arrays.asList(new Coin(27L, "5c", 5, 0, 1F), new Coin(28L, "10c", 10, 0, 1F)));
    initialFileData.setDrinks(Arrays.asList(new Drink(32L, "Coca-Cola", 75, 4, 1), new Drink(33L, "Fanta", 89, 7, 2)));


    fileDataAdapter.write(initialFileData);

    String content = new String(Files.readAllBytes(Paths.get(testFilePath)));
    assertEquals(content, expectedOutput);
  }


  @Test
  public void whenGotFromJsonInitialFile_thenReadCorrect() throws IOException {
    final String testFilePath = "test_init_file.json";
    File yamlOutput = new File(testFilePath);
    FileWriter fileWriter = new FileWriter(yamlOutput);
    fileWriter.write("{\n" +
      "    \"users\": [\n" +
      "        {\n" +
      "            \"id\": 25,\n" +
      "            \"role\": \"Maintainer\",\n" +
      "            \"password\": \"123891\",\n" +
      "            \"status\": \"logout\"\n" +
      "        }\n" +
      "    ],\n" +
      "    \"machines\": [\n" +
      "        {\n" +
      "            \"id\": 26,\n" +
      "            \"name\": \"Star6ucks\",\n" +
      "            \"doorLocked\": true,\n" +
      "            \"status\": \"normal\"\n" +
      "        }\n" +
      "    ],\n" +
      "    \"coins\": [\n" +
      "        { \"id\": 27, \"name\": \"5c\", \"value\": 5, \"quantity\": 0, \"weight\": 1.0 },\n" +
      "        { \"id\": 28, \"name\": \"10c\", \"value\": 10, \"quantity\": 0, \"weight\": 1.0 }\n" +
      "    ],\n" +
      "    \"drinks\": [\n" +
      "        {\n" +
      "            \"id\": 32,\n" +
      "            \"name\": \"Coca-Cola\",\n" +
      "            \"price\": 75,\n" +
      "            \"quantity\": 4,\n" +
      "            \"slotNum\": 1\n" +
      "        },\n" +
      "        { \"id\": 33, \"name\": \"Fanta\", \"price\": 89, \"quantity\": 7, \"slotNum\": 2 }\n" +
      "    ]\n" +
      "}\n");
    fileWriter.close();

    InitialJsonFileDataAdapter fileDataAdapter = new InitialJsonFileDataAdapter(testFilePath);
    InitialFileDataBean initialFileData = fileDataAdapter.read();

    final ObjectMapper mapper = new ObjectMapper();

    assertEquals(
      mapper.writeValueAsString(initialFileData.getUsers()),
      mapper.writeValueAsString(Collections.singletonList(new User(25L, "Maintainer", "123891", "logout")))
    );
    assertEquals(
      mapper.writeValueAsString(initialFileData.getMachines()),
      mapper.writeValueAsString(Collections.singletonList(new Machine(26L, "Star6ucks", true, "normal")))
    );
    assertEquals(
      mapper.writeValueAsString(initialFileData.getCoins()),
      mapper.writeValueAsString(Arrays.asList(new Coin(27L, "5c", 5, 0, 1F), new Coin(28L, "10c", 10, 0, 1F)))
    );
    assertEquals(
      mapper.writeValueAsString(initialFileData.getDrinks()),
      mapper.writeValueAsString(Arrays.asList(new Drink(32L, "Coca-Cola", 75, 4, 1), new Drink(33L, "Fanta", 89, 7, 2)))
    );
  }

  @Test
  public void whenGotFromJsonInitialFile_thenWriteCorrect() throws IOException {
    final String testFilePath = "test_init_file.json";
    final String expectedOutput = "{\"users\":[{\"id\":25,\"role\":\"Maintainer\",\"password\":\"123891\",\"status\":\"logout\"}],\"machines\":[{\"id\":26,\"name\":\"Star6ucks\",\"doorLocked\":true,\"status\":\"normal\"}],\"drinks\":[{\"id\":32,\"name\":\"Coca-Cola\",\"price\":75,\"quantity\":4,\"slotNum\":1},{\"id\":33,\"name\":\"Fanta\",\"price\":89,\"quantity\":7,\"slotNum\":2}],\"coins\":[{\"id\":27,\"name\":\"5c\",\"value\":5,\"quantity\":0,\"weight\":1.0},{\"id\":28,\"name\":\"10c\",\"value\":10,\"quantity\":0,\"weight\":1.0}]}";
    InitialJsonFileDataAdapter fileDataAdapter = new InitialJsonFileDataAdapter(testFilePath);
    InitialFileDataBean initialFileData = new InitialFileDataBean();

    initialFileData.setUsers(Collections.singletonList(new User(25L, "Maintainer", "123891", "logout")));
    initialFileData.setMachines(Collections.singletonList(new Machine(26L, "Star6ucks", true, "normal")));
    initialFileData.setCoins(Arrays.asList(new Coin(27L, "5c", 5, 0, 1F), new Coin(28L, "10c", 10, 0, 1F)));
    initialFileData.setDrinks(Arrays.asList(new Drink(32L, "Coca-Cola", 75, 4, 1), new Drink(33L, "Fanta", 89, 7, 2)));


    fileDataAdapter.write(initialFileData);

    String content = new String(Files.readAllBytes(Paths.get(testFilePath)));
    assertEquals(content, expectedOutput);
  }
}


