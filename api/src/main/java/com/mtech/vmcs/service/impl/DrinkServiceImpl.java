package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.repository.DrinkRepository;
import com.mtech.vmcs.service.DrinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class DrinkServiceImpl implements DrinkService {

  @Autowired private DrinkRepository drinkRepository;

  @Override
  public List<Drink> getDrinksByName(String name) {
    return drinkRepository.findAllByName(name);
  }

  @Override
  public List<Drink> getAllDrinks() {
    return StreamSupport.stream(drinkRepository.findAll().spliterator(), false)
        .collect(Collectors.toList());
  }

  @Override
  public void createDrinks(List<Drink> drinks) {
    drinkRepository.saveAll(drinks);
  }

  @Override
  public void updateDrinks(List<Drink> drinks) {
    drinkRepository.saveAll(drinks);
  }

  @Override
  public void deleteDrinks(List<Long> drinkIds) {
    drinkRepository.deleteAllById(drinkIds);
  }
}
