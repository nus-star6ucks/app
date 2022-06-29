package com.mtech.vmcs.service.impl.initialfiledata;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;

public interface IInitialFileDataAdapter {
  InitialFileDataBean read() throws IOException;

  void write(InitialFileDataBean initialFileData) throws IOException;
}
