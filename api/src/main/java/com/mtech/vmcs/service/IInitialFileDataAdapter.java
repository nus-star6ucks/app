package com.mtech.vmcs.service;


import com.mtech.vmcs.model.entity.InitialFileData;

import java.io.IOException;

public interface IInitialFileDataAdapter {
  InitialFileData read() throws IOException;

  void write(InitialFileData initialFileData) throws IOException;
}
