package com.mtech.vmcs.service.impl.initialfiledata;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;

public class InitialJsonFileDataAdapter implements IInitialFileDataAdapter {
  private File file;

  public InitialJsonFileDataAdapter(String filePath) {
    this.file = new File(filePath);
  }

  @Override
  public InitialFileDataBean read() throws IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    return objectMapper.readValue(this.file, InitialFileDataBean.class);
  }

  @Override
  public void write(InitialFileDataBean initialFileData) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.writeValue(this.file, initialFileData);
  }
}
