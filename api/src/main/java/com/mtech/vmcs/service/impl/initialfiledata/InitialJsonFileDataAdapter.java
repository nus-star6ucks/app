package com.mtech.vmcs.service.impl.initialfiledata;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mtech.vmcs.model.entity.InitialFileData;
import com.mtech.vmcs.service.IInitialFileDataAdapter;

import java.io.File;
import java.io.IOException;

public class InitialJsonFileDataAdapter implements IInitialFileDataAdapter {
  private File file;

  public InitialJsonFileDataAdapter(String filePath) {
    this.file = new File(filePath);
  }

  @Override
  public InitialFileData read() throws IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    return objectMapper.readValue(this.file, InitialFileData.class);
  }

  @Override
  public void write(InitialFileData initialFileData) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.writeValue(this.file, initialFileData);
  }
}
