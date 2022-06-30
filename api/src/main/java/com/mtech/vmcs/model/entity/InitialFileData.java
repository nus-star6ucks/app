package com.mtech.vmcs.model.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InitialFileData {

  private List<User> users;

  private List<Machine> machines;

  private List<Drink> drinks;

  private List<Coin> coins;
}
