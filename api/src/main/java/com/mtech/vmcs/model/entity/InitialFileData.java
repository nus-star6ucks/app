package com.mtech.vmcs.model.entity;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

public class InitialFileData {
  @Getter
  @Setter
  private List<User> users;

  @Getter
  @Setter
  private List<Machine> machines;

  @Getter
  @Setter
  private List<Drink> drinks;

  @Getter
  @Setter
  private List<Coin> coins;
}
