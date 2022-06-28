package com.mtech.vmcs.service.impl.initialfiledata;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.mtech.vmcs.model.entity.Coin;
import com.mtech.vmcs.model.entity.Drink;
import com.mtech.vmcs.model.entity.Machine;
import com.mtech.vmcs.model.entity.User;
import com.mtech.vmcs.repository.MachineRepository;
import com.mtech.vmcs.service.CoinService;
import com.mtech.vmcs.service.DrinkService;
import com.mtech.vmcs.service.MachineService;
import com.mtech.vmcs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class InitialXmlFileDataAdapter implements IInitialFileDataAdapter {
  private File file;

  public InitialXmlFileDataAdapter(String filePath) {
    this.file = new File(filePath);
  }

  @Override
  public JsonNode read() throws IOException {
    XmlMapper xmlMapper = new XmlMapper();
    return xmlMapper.readTree(this.file);
  }

  @Override
  public void write(ObjectNode objectNode) throws IOException {
    XmlMapper xmlMapper = new XmlMapper();
    xmlMapper.writeValue(this.file, objectNode);
  }
}
