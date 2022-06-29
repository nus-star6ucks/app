package com.mtech.vmcs.repository;

import com.mtech.vmcs.model.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Long> {

  List<User> findAllByRole(String role);
}
