import { ConflictException, Injectable } from '@nestjs/common';
import { ClientDto } from './dto/client-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entity/client.entity';
import { Repository } from 'typeorm';
import { Address } from './entity/address.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async findClient(client: ClientDto) {
    return await this.clientRepository.findOne({
      where: [{ id: client.id }, { email: client.email }],
    });
  }

  findClientByEmail(email: string) {
    return this.clientRepository.findOne({
      where: { email },
    });
  }

  async createClient(client: ClientDto) {
    const clientExist = await this.findClient(client);

    if (clientExist) {
      if (client.id)
        throw new ConflictException(`El Cliente con id ${client.id} existe`);
      else if (client.email)
        throw new ConflictException(
          `El Cliente con email  ${client.email} existe`,
        );
    }

    let addressExist: Address = null;

    if (client.address.id) {
      addressExist = await this.addressRepository.findOne({
        where: {
          id: client.address.id,
        },
      });
    } else {
      addressExist = await this.addressRepository.findOne({
        where: {
          country: client.address.country,
          province: client.address.province,
          town: client.address.town,
          street: client.address.street,
        },
      });
    }

    if (addressExist) {
      throw new ConflictException('la direccion ya existe');
    }

    return this.clientRepository.save(client);
  }

  getClients() {
    return this.clientRepository.find();
  }

  getClientById(id: number) {
    return this.clientRepository.findOne({
      where: { id },
    });
  }

  async updateClient(client: ClientDto) {
    if (!client.id) {
      return this.createClient(client);
    }

    let clientExist = await this.findClientByEmail(client.email);

    if (clientExist && clientExist.id != client.id) {
      throw new ConflictException(
        `El Cliente con el email ${client.email} existe `,
      );
    }

    clientExist = await this.getClientById(client.id);

    let addressExist: Address = null;
    let deleteAddress: boolean = false;

    if (client.address.id) {
      addressExist = await this.addressRepository.findOne({
        where: {
          id: client.address.id,
        },
      });

      if (addressExist && addressExist.id != clientExist.address.id) {
        throw new ConflictException('la direccion ya existe');
      } else if (
        JSON.stringify(addressExist) != JSON.stringify(client.address)
      ) {
        addressExist = await this.addressRepository.findOne({
          where: {
            country: client.address.country,
            province: client.address.province,
            town: client.address.town,
            street: client.address.street,
          },
        });

        if (addressExist) {
          throw new ConflictException('la direccion ya existe');
        } else {
          deleteAddress = true;
        }
      }
    } else {
      addressExist = await this.addressRepository.findOne({
        where: {
          country: client.address.country,
          province: client.address.province,
          town: client.address.town,
          street: client.address.street,
        },
      });

      if (addressExist) {
        throw new ConflictException('la direccion ya existe');
      } else {
        deleteAddress = true;
      }
    }

    const updateClient = await this.clientRepository.save(client);

    if (deleteAddress) {
      await this.addressRepository.delete({
        id: clientExist.id,
      });
    }

    return updateClient;
  }

  async deleteClient(id: number) {
    const clientExist = await this.getClientById(id);

    if (!clientExist) {
      throw new ConflictException(`El Cliente con el id: ${id} no existe`);
    }

    const rows = await this.clientRepository.delete({ id });

    if (rows.affected === 1) {
      await this.addressRepository.delete({
        id: clientExist.address.id,
      });
      return true;
    }

    return false;
  }
}
