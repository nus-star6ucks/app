package com.mtech.vmcs;

import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.repository.DrinkRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest
class VmcsApplicationTests {

  @Autowired private DrinkRepository drinkRepository;

  @Test
  void contextLoads() {

    Drink drink = new Drink(123L, "Fanta", 85, 20, 1);
    drinkRepository.save(drink);
    System.out.println("Success");
  }
}
