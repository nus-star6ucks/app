package com.mtech.vmcs.service.impl.initialfiledata;


import java.io.IOException;

public interface IInitialFileDataAdapter {
  InitialFileDataBean read() throws IOException;

  void write(InitialFileDataBean initialFileData) throws IOException;
}
