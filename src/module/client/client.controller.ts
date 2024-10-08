import { Controller } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('api/v1/clients')
export class ClientController {
  constructor(private clientService: ClientService) {}
}
