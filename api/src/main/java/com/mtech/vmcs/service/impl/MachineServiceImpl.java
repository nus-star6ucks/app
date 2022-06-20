package com.mtech.vmcs.service.impl;

import com.mtech.vmcs.model.entity.Machine;
import com.mtech.vmcs.repository.MachineRepository;
import com.mtech.vmcs.service.MachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class MachineServiceImpl implements MachineService {

  @Autowired private MachineRepository machineRepository;

  @Override
  public List<Machine> getAllMachines() {
    return StreamSupport.stream(machineRepository.findAll().spliterator(), false)
        .collect(Collectors.toList());
  }

  @Override
  public void createMachines(List<Machine> machines) {
    machineRepository.saveAll(machines);
  }

  @Override
  public void updateMachines(List<Machine> machines) {
    machineRepository.saveAll(machines);
  }

  @Override
  public void deleteMachines(List<Long> machineIds) {
    machineRepository.deleteAllById(machineIds);
  }
}
