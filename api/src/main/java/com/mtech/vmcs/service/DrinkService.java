package com.mtech.vmcs.service;

import com.mtech.vmcs.model.entity.Drink;

import java.util.List;

public interface DrinkService {

  List<Drink> getAllDrinks();

  void createDrinks(List<Drink> drinks);

  void updateDrinks(List<Drink> drinks);

  void deleteDrinks(List<Long> drinkIds);
}
