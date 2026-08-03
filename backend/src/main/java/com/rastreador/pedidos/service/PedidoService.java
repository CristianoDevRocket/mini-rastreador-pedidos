package com.rastreador.pedidos.service;

import com.rastreador.pedidos.dto.request.PedidoRequest;
import com.rastreador.pedidos.dto.request.StatusUpdateRequest;
import com.rastreador.pedidos.dto.response.PagedResponse;
import com.rastreador.pedidos.dto.response.PedidoResponse;
import com.rastreador.pedidos.entity.Pedido;
import com.rastreador.pedidos.enums.StatusPedido;
import com.rastreador.pedidos.exception.BusinessException;
import com.rastreador.pedidos.exception.ResourceNotFoundException;
import com.rastreador.pedidos.mapper.PedidoMapper;
import com.rastreador.pedidos.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private static final Map<StatusPedido, EnumSet<StatusPedido>> TRANSICOES_VALIDAS = Map.of(
            StatusPedido.RECEBIDO, EnumSet.of(StatusPedido.EM_PREPARO, StatusPedido.CANCELADO),
            StatusPedido.EM_PREPARO, EnumSet.of(StatusPedido.SAIU_PARA_ENTREGA, StatusPedido.CANCELADO),
            StatusPedido.SAIU_PARA_ENTREGA, EnumSet.of(StatusPedido.ENTREGUE, StatusPedido.CANCELADO),
            StatusPedido.ENTREGUE, EnumSet.noneOf(StatusPedido.class),
            StatusPedido.CANCELADO, EnumSet.noneOf(StatusPedido.class)
    );

    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;

    @Transactional
    public PedidoResponse criar(PedidoRequest request) {
        Pedido pedido = pedidoMapper.toEntity(request);
        return pedidoMapper.toResponse(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse atualizarStatus(Long id, StatusUpdateRequest request) {
        Pedido pedido = buscarOuFalhar(id);
        StatusPedido statusAtual = pedido.getStatus();
        StatusPedido novoStatus = request.status();

        if (!TRANSICOES_VALIDAS.get(statusAtual).contains(novoStatus)) {
            throw new BusinessException(
                    "Transição de status inválida: %s -> %s".formatted(statusAtual, novoStatus));
        }

        pedido.setStatus(novoStatus);
        return pedidoMapper.toResponse(pedido);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PedidoResponse> listarTodos(Pageable pageable) {
        Page<Pedido> pagina = pedidoRepository.findAll(pageable);
        return PagedResponse.from(pagina, pedidoMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarPorId(Long id) {
        return pedidoMapper.toResponse(buscarOuFalhar(id));
    }

    private Pedido buscarOuFalhar(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + id));
    }
}
