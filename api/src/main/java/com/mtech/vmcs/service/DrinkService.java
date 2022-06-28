package com.mtech.vmcs.service;

import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.PurchaseOrder;

import java.util.List;
import java.util.Map;

public interface DrinkService {

  List<Drink> getDrinksByName(String name);

  List<Drink> getAllDrinks();

  void createDrinks(List<Drink> drinks);

  void updateDrinks(List<Drink> drinks);

  void deleteDrinks(List<Long> drinkIds);

  Map<String, Object> purchase(PurchaseOrder purchaseOrder);

  void undoPurchase();
}
