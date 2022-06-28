package com.mtech.vmcs.service.impl;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.repository.CoinRepository;
import com.mtech.vmcs.repository.MachineRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class MachineServiceImplTest {

  @Mock
  MachineRepository machineRepository;

  @InjectMocks
  MachineServiceImpl machineService;

  @Test
  public void whenGotFromXmlInitialFile_thenCorrect() throws IOException {
    XmlMapper xmlMapper = new XmlMapper();
    xmlMapper.writeValue(new File("simple_bean.xml"), new SimpleBean());
    File file = new File("simple_bean.xml");

//    List<Coin> coins = Collections.singletonList(new Coin(123L, "Fanta", 85, 20, 1F));
//
//    when(coinRepository.findAll()).thenReturn(coins);
//
//    List<Coin> coinList = coinService.getAllCoins();
//
//    assertEquals(1, coinList.size());
//    assertEquals("Fanta", coinList.get(0).getName());
//
//    verify(coinRepository, times(1)).findAll();
  }
}
