package com.mtech.vmcs.service.impl.initialfiledata;

import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.Machine;
import com.mtech.vmcs.model.entity.User;

import java.util.List;

public class InitialFileDataBean {
  private List<User> users;
  private List<Machine> machines;
  private List<Drink> drinks;
  private List<Coin> coins;

  public List<Machine> getMachines() {
    return machines;
  }

  public void setMachines(List<Machine> machines) {
    this.machines = machines;
  }

  public List<Drink> getDrinks() {
    return drinks;
  }

  public void setDrinks(List<Drink> drinks) {
    this.drinks = drinks;
  }

  public List<Coin> getCoins() {
    return coins;
  }

  public void setCoins(List<Coin> coins) {
    this.coins = coins;
  }

  public List<User> getUsers() {
    return this.users;
  }

  public void setUsers(List<User> users) {
    this.users = users;
  }

}
