package com.mtech.vmcs.repository;

import com.mtech.vmcs.model.entity.Drink;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface DrinkRepository extends CrudRepository<Drink, Long> {

  List<Drink> findAllByName(String name);
}
